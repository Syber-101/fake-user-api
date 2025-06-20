const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
const { faker } = require('@faker-js/faker');

const countries = ['Turkey', 'France', 'Germany', 'USA', 'Japan'];
const cities = {
  'Turkey': ['Istanbul', 'Ankara', 'Izmir'],
  'France': ['Paris', 'Lyon', 'Nice'],
  'Germany': ['Berlin', 'Munich', 'Hamburg'],
  'USA': ['New York', 'Los Angeles', 'Chicago'],
  'Japan': ['Tokyo', 'Osaka', 'Kyoto']
};

const randomFromArray = arr => arr[Math.floor(Math.random() * arr.length)];

const generateUser = (id = null) => {
  const country = randomFromArray(countries);
  const city = randomFromArray(cities[country]);
  return {
    id: id || Math.random().toString(36).substr(2, 9),
    name: faker.person.fullName(),  
    email: faker.internet.email(),
    phone: `+90${Math.floor(Math.random() * 1000000000)}`,
    address: `${Math.floor(Math.random() * 100)} Fake Street`,
    city,
    country
  };
};

app.get('/api/users', (req, res) => {
  const count = parseInt(req.query.count) || 10;
  const filterCountry = req.query.country?.toLowerCase();
  const filterCity = req.query.city?.toLowerCase();

  const users = [];
  let attempts = 0;
  const maxAttempts = 10000;

  while (users.length < count && attempts < maxAttempts) {
    const user = generateUser();
    attempts++;

    let countryMatch = true;
    let cityMatch = true;

    if (filterCountry) {
      countryMatch = user.country.toLowerCase().includes(filterCountry);
    }
    if (filterCity) {
      cityMatch = user.city.toLowerCase().includes(filterCity);
    }

    if (countryMatch && cityMatch) {
      users.push(user);
    }
  }

  if (users.length < count) {
    res.status(404).json({
      message: `Yeterli eşleşen kullanıcı bulunamadı.`,
      generated: users.length,
      data: users
    });
  } else {
    res.json(users);
  }
});

app.listen(3000, () => console.log('🚀 Fake User API 3000 portunda çalışıyor.'));
