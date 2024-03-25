const express = require('express');
const dbCon = require('../config/db.js');
const router = express.Router();

router.get("/language", (req, res) => {
    res.render("language");
});

router.post('/submit-form', (req, res) => {
   
    const languages = req.body['languages[]']; // Retrieve selected languages from FormData

  // Insert into database
  const sql = 'INSERT INTO language_proficiency (`id`,`language`, `read`, `write`, `speak`) VALUES (?,?, ?, ?, ?)';
  if (typeof languages=="string") {
      // Only one language selected
      
      
      const readValue = req.body[`read_${languages.toLowerCase()}`] === 'Read' ? 1 : 0;
      const writeValue = req.body[`write_${languages.toLowerCase()}`] === 'Write' ? 1 : 0;
      const speakValue = req.body[`speak_${languages.toLowerCase()}`] === 'Speak' ? 1 : 0;
      dbCon.query(sql,[1,languages, readValue, writeValue, speakValue], (err, result) => {
          if (err) {
              console.error('Error inserting data:', err);
              // Don't send response here
          } else {
              console.log('Language proficiency added successfully');
              // You may want to send response here if needed
          }
      });
  } else {
      // More than one language selected
    console.log(sql)
      languages.forEach(language => {
          const readValue = req.body[`read_${language.toLowerCase()}`] === 'Read' ? 1 : 0;
          const writeValue = req.body[`write_${language.toLowerCase()}`] === 'Write' ? 1 : 0;
          const speakValue = req.body[`speak_${language.toLowerCase()}`] === 'Speak' ? 1 : 0;
          dbCon.query(sql, [1,language, readValue, writeValue, speakValue], (err, result) => {
              if (err) {
                  console.error('Error inserting data:', err);
                  // Don't send response here
              } else {
                  console.log('Language proficiency added successfully');
                  // You may want to send response here if needed
              }
          });
      });
  }

    // Send response after all insertions are done
    res.send('Form submitted successfully');
});

router.get('/edit-form', (req, res) => {
    // Query the database to retrieve existing language proficiency data for the user
    const userId = req.query.user;
 // Assuming you have user authentication and userId is available in req.user
    const sql = 'SELECT * FROM language_proficiency WHERE id = ?';
    console.log(userId)
    dbCon.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error retrieving data:', err);
            // Handle the error appropriately (e.g., show an error page)
            return res.status(500).send('Internal Server Error');
        }
        
        // Render the form and pass the existing data to populate the form

        res.render('edit-form', { languages: results });
    });
});

router.post('/update-form', (req, res) => {
   const userId=req.query.user;
    const languages = req.body['languages[]']; // Retrieve selected languages from FormData

    // Update existing data in the database
    const updateSql = 'UPDATE language_proficiency SET `read` = ?, `write` = ?, `speak` = ? WHERE id = ? AND language = ?';
    languages.forEach(language => {
        const readValue = req.body[`read_${language.toLowerCase()}`] === 'Read' ? 1 : 0;
        const writeValue = req.body[`write_${language.toLowerCase()}`] === 'Write' ? 1 : 0;
        const speakValue = req.body[`speak_${language.toLowerCase()}`] === 'Speak' ? 1 : 0;
      console.log(readValue);
      console.log(writeValue);
      console.log(speakValue);
      console.log(userId);
      console.log(language);
        dbCon.query(updateSql, [readValue, writeValue, speakValue, userId, language], (updateErr, updateResult) => {
            if (updateErr) {
                console.error('Error updating data:', updateErr);
                // Handle the error appropriately (e.g., show an error page)
                return res.status(500).send('Internal Server Error');
            }
            
        });
    });

  
});

module.exports = router;
