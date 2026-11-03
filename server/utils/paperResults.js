const { getDB } = require('../config/database');

const paperResults = () => async (req, res, next) => {
  try {
    console.log('DEBUG: MySQL paperResults middleware executed');
    const db = getDB();

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const offset = (page - 1) * limit;

    const allowedSort = {
      createdAt: 'p.createdAt',
      title: 'p.title',
      downloads: 'p.downloads',
      views: 'p.views',
      examYear: 'p.examYear'
    };

    const requestedSort = String(req.query.sort || '-createdAt').split(',')[0];
    const descending = requestedSort.startsWith('-');
    const sortKey = requestedSort.replace(/^-/, '');
    const sortColumn = allowedSort[sortKey] || 'p.createdAt';
    const sortDirection = descending ? 'DESC' : 'ASC';

    const conditions = [];
    const params = [];

    if (req.query.search) {
      conditions.push(
        '(p.title LIKE ? OR p.description LIKE ? OR p.subjectCode LIKE ?)'
      );
      const search = `%${String(req.query.search).slice(0, 200)}%`;
      params.push(search, search, search);
    }

    // Public listing/search only shows approved papers.
    conditions.push("p.status = 'Approved'");

    const where = `WHERE ${conditions.join(' AND ')}`;

    const [countRows] = await db.execute(
      `SELECT COUNT(*) AS total FROM papers p ${where}`,
      params
    );

    const [rows] = await db.execute(
      `SELECT p.*,
              u.name AS universityName,
              c.name AS collegeName,
              d.name AS departmentName,
              co.name AS courseName,
              s.name AS subjectName,
              s.code AS subjectCodeName,
              usr.name AS uploadedByName
       FROM papers p
       LEFT JOIN universities u ON p.university = u.id
       LEFT JOIN colleges c ON p.college = c.id
       LEFT JOIN departments d ON p.department = d.id
       LEFT JOIN courses co ON p.course = co.id
       LEFT JOIN subjects s ON p.subject = s.id
       LEFT JOIN users usr ON p.uploadedBy = usr.id
       ${where}
       ORDER BY ${sortColumn} ${sortDirection}
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const total = Number(countRows[0].total);
    const pagination = {};

    if (offset + rows.length < total) {
      pagination.next = { page: page + 1, limit };
    }
    if (page > 1) {
      pagination.prev = { page: page - 1, limit };
    }

    res.advancedResults = {
      success: true,
      count: rows.length,
      pagination,
      total,
      data: rows
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = paperResults;
