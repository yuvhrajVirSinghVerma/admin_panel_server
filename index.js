const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ExcelJS = require('exceljs');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

let users = [
  { id: 1, name: "Test User", email: "test@gmail.com" },
];

let locationData = [
  { lat: 37.7749, lon: -122.4194 },
  { lat: 37.7750, lon: -122.4195 },
  { lat: 37.7751, lon: -122.4196 },
  { lat: 37.7752, lon: -122.4196 },
  { lat: 37.7753, lon: -122.4197 },
  { lat: 37.7754, lon: -122.4197 },
  { lat: 37.7755, lon: -122.4198 },
  { lat: 37.7756, lon: -122.4198 },
  { lat: 37.7757, lon: -122.4199 },
  { lat: 37.7758, lon: -122.4199 },
  { lat: 38.7749, lon: -122.4194 },
  { lat: 39.7750, lon: -122.4195 },
  { lat: 39.7751, lon: -122.4196 },
  { lat: 40.7752, lon: -122.4196 },
  { lat: 40.7753, lon: -122.4197 },
  { lat: 40.7754, lon: -122.4197 },
  { lat: 41.7755, lon: -122.4198 },
  { lat: 41.7756, lon: -122.4198 },
  { lat: 42.7757, lon: -122.4199 },
  { lat: 43.7758, lon: -122.4199 },

];

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);
  res.json(newUser);
});

app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const userIndex = users.findIndex(user => user.id == id);
  if (userIndex !== -1) {
    users[userIndex] = { id, name, email };
    res.json(users[userIndex]);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  users = users.filter(user => user.id != id);
  res.status(204).end();
});

app.get('/api/export', async (req, res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Users');
  
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Name', key: 'name', width: 30 },
    { header: 'Email', key: 'email', width: 30 }
  ];
  
  users.forEach(user => {
    worksheet.addRow(user);
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');

  await workbook.xlsx.write(res);
  res.end();
});

app.get('/api/live-location', (req, res) => {
  let index = 0;
  const intervalId = setInterval(() => {
    if (index < locationData.length) {
      res.write(JSON.stringify(locationData[index]));
      res.write("\n");
      index++;
    } else {
      clearInterval(intervalId);
      res.end();
    }
  }, 1000); 
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
