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

// Get all issues
exports.getAllIssues = async (req, res) => {
    try {
        const [issues] = await pool.query(`
            SELECT i.*, u.name as user_name, u.email as user_email 
            FROM issues i 
            LEFT JOIN users u ON i.user_id = u.id 
            ORDER BY i.created_at DESC
        `);

        res.json({
            success: true,
            issues
        });
    } catch (error) {
        console.error('Get issues error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};