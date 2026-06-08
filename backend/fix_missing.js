const fs = require('fs');

// Fix feedbackController.js
let fbCode = fs.readFileSync('controllers/feedbackController.js', 'utf8');
fbCode = fbCode.replace(/let feedbacksCollection;\nconst getCollection = async \(name\) => { const db = await connectDB\(\); return db\.collection\(name\); };/g, 'const getCollection = async (name) => { const db = await connectDB(); return db.collection(name); };');
fbCode = fbCode.replace(/feedbacksCollection/g, '(await getCollection("feedbacks"))');
fbCode = fbCode.replace(/coursesCollection/g, '(await getCollection("courses"))');
fs.writeFileSync('controllers/feedbackController.js', fbCode);
console.log("feedbackController updated");

// Fix assignmentController.js
let assignCode = fs.readFileSync('controllers/assignmentController.js', 'utf8');
assignCode = assignCode.replace(/let assignmentsCollection;\nlet submissionsCollection;\n\n\(\async \(\) => {\n  const db = await connectDB\(\);\n  assignmentsCollection = db\.collection\("assignments"\);\n  submissionsCollection = db\.collection\("submissions"\);\n}\)\(\);/m, 'const getCollection = async (name) => { const db = await connectDB(); return db.collection(name); };');
assignCode = assignCode.replace(/assignmentsCollection/g, '(await getCollection("assignments"))');
assignCode = assignCode.replace(/submissionsCollection/g, '(await getCollection("submissions"))');
fs.writeFileSync('controllers/assignmentController.js', assignCode);
console.log("assignmentController updated");
