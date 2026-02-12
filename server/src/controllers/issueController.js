const { pool } = require('../config/database');

// Create new issue
exports.createIssue = async (req, res) => {
    try {
        const { title, description, priority, severity } = req.body;
        const user_id = req.user.id; // From auth middleware

        // Validation
        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        if (title.length < 3) {
            return res.status(400).json({ message: 'Title must be at least 3 characters' });
        }

        if (description.length < 10) {
            return res.status(400).json({ message: 'Description must be at least 10 characters' });
        }

        const [result] = await pool.query(
            `INSERT INTO issues (title, description, priority, severity, user_id, status) 
             VALUES (?, ?, ?, ?, ?, 'open')`,
            [
                title,
                description,
                priority || 'medium',
                severity || 'major',
                user_id
            ]
        );

        const [newIssue] = await pool.query(
            `SELECT i.*, u.name as user_name, u.email as user_email 
             FROM issues i 
             LEFT JOIN users u ON i.user_id = u.id 
             WHERE i.id = ?`,
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Issue created successfully',
            issue: newIssue[0]
        });
    } catch (error) {
        console.error('Create issue error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Get all issues with filters, search, and pagination
exports.getAllIssues = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            priority,
            severity,
            search
        } = req.query;

        const offset = (page - 1) * limit;

        let query = `
            SELECT i.*, u.name as user_name, u.email as user_email 
            FROM issues i 
            LEFT JOIN users u ON i.user_id = u.id 
            WHERE 1=1
        `;

        const params = [];

        // Apply filters
        if (status) {
            query += ' AND i.status = ?';
            params.push(status);
        }

        if (priority) {
            query += ' AND i.priority = ?';
            params.push(priority);
        }

        if (severity) {
            query += ' AND i.severity = ?';
            params.push(severity);
        }

        // Apply search (searches in title and description)
        if (search) {
            query += ' AND (i.title LIKE ? OR i.description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        // Get total count for pagination
        const countQuery = query.replace(
            'SELECT i.*, u.name as user_name, u.email as user_email',
            'SELECT COUNT(*) as total'
        );
        const [countResult] = await pool.query(countQuery, params);
        const total = countResult[0].total;

        // Add ordering and pagination
        query += ' ORDER BY i.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [issues] = await pool.query(query, params);

        res.json({
            success: true,
            issues,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get issues error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

//get issue by id
exports.getIssueById = async (req, res) => {
    try {
        const { id } = req.params;

        const [issues] = await pool.query(
            `SELECT i.*, u.name as user_name, u.email as user_email 
             FROM issues i 
             LEFT JOIN users u ON i.user_id = u.id 
             WHERE i.id = ?`,
            [id]
        );

        if (issues.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Issue not found'
            });
        }

        res.json({
            success: true,
            issue: issues[0]
        });
    } catch (error) {
        console.error('Get issue error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get issue statistics (counts by status)
exports.getIssueStatus = async (req, res) => {
    try {
        const [stats] = await pool.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open,
                SUM(CASE WHEN status = 'in-progress' THEN 1 ELSE 0 END) as in_progress,
                SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
                SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed
            FROM issues
        `);

        res.json({
            success: true,
            stats: stats[0]
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update issue
exports.updateIssue = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority, severity } = req.body;

        // Check if issue exists
        const [existing] = await pool.query('SELECT * FROM issues WHERE id = ?', [id]);

        if (existing.length === 0) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        // Build update query dynamically
        const updates = [];
        const params = [];

        if (title !== undefined) {
            if (title.length < 3) {
                return res.status(400).json({ message: 'Title must be at least 3 characters' });
            }
            updates.push('title = ?');
            params.push(title);
        }

        if (description !== undefined) {
            if (description.length < 10) {
                return res.status(400).json({ message: 'Description must be at least 10 characters' });
            }
            updates.push('description = ?');
            params.push(description);
        }

        if (status !== undefined) {
            const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: 'Invalid status' });
            }
            updates.push('status = ?');
            params.push(status);
        }

        if (priority !== undefined) {
            const validPriorities = ['low', 'medium', 'high', 'critical'];
            if (!validPriorities.includes(priority)) {
                return res.status(400).json({ message: 'Invalid priority' });
            }
            updates.push('priority = ?');
            params.push(priority);
        }

        if (severity !== undefined) {
            const validSeverities = ['minor', 'major', 'critical'];
            if (!validSeverities.includes(severity)) {
                return res.status(400).json({ message: 'Invalid severity' });
            }
            updates.push('severity = ?');
            params.push(severity);
        }

        if (updates.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        params.push(id);

        await pool.query(
            `UPDATE issues SET ${updates.join(', ')} WHERE id = ?`,
            params
        );

        const [updatedIssue] = await pool.query(
            `SELECT i.*, u.name as user_name, u.email as user_email 
             FROM issues i 
             LEFT JOIN users u ON i.user_id = u.id 
             WHERE i.id = ?`,
            [id]
        );

        res.json({
            success: true,
            message: 'Issue updated successfully',
            issue: updatedIssue[0]
        });
    } catch (error) {
        console.error('Update issue error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete issue
exports.deleteIssue = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query('DELETE FROM issues WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        res.json({
            success: true,
            message: 'Issue deleted successfully'
        });
    } catch (error) {
        console.error('Delete issue error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};