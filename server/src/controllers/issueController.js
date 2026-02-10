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