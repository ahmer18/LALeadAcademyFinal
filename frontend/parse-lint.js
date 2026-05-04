const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./eslint-output.json', 'utf8'));

data.forEach(file => {
  if (file.messages.length > 0 && (file.filePath.includes('CourseSummery') || file.filePath.includes('ModulePlayer') || file.filePath.includes('CourseAssignments'))) {
    console.log(`\n📄 ${file.filePath}`);
    file.messages.forEach(msg => {
      console.log(`  Line ${msg.line}: ${msg.message} [${msg.ruleId}]`);
    });
  }
});
