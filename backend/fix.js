const fs = require('fs');

let code = fs.readFileSync('controllers/courseController.js', 'utf8');

// Replace the IIFE
code = code.replace(
  /let db, usersCollection, coursesCollection, enrollmentsCollection;\s*\([\s\S]*?\)\(\);/m,
  'const getCollection = async (name) => { const db = await connectDB(); return db.collection(name); };'
);

code = code.replace(/usersCollection/g, '(await getCollection("users"))');
code = code.replace(/coursesCollection/g, '(await getCollection("courses"))');
code = code.replace(/enrollmentsCollection/g, '(await getCollection("enrollments"))');

fs.writeFileSync('controllers/courseController.js', code);
console.log("courseController updated");
