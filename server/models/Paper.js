const { getDB } = require('../config/database');

const Paper = {
  async findById(id) {
    const db = getDB();
    const [rows] = await db.execute(
      'SELECT * FROM papers WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  },

  async create(data) {
    const db = getDB();

    const fields = [
      'title', 'description', 'university', 'college', 'department',
      'course', 'schoolClass', 'branch', 'semester', 'subject',
      'subjectCode', 'examType', 'academicYear', 'examYear', 'language',
      'duration', 'maximumMarks', 'pdfURL', 'originalFileName',
      'public_id', 'resource_type', 'type', 'thumbnail', 'uploadedBy',
      'approved', 'status'
    ];

    const values = fields.map(field => {
      const value = data[field];
      return value === '' || value === undefined ? null : value;
    });

    const placeholders = fields.map(() => '?').join(', ');
    const columns = fields.map(field => `\`${field}\``).join(', ');

    const [result] = await db.execute(
      `INSERT INTO papers (${columns}) VALUES (${placeholders})`,
      values
    );

    return this.findById(result.insertId);
  },

  async incrementCounter(id, column) {
    if (!['views', 'downloads'].includes(column)) {
      throw new Error('Invalid counter');
    }

    const db = getDB();
    await db.execute(
      `UPDATE papers SET \`${column}\` = \`${column}\` + 1 WHERE id = ?`,
      [id]
    );

    return this.findById(id);
  }
};

module.exports = Paper;
