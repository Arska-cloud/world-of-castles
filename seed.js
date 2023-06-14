const mongoose = require('mongoose');
const Castle = require('./models/castle');

mongoose.connect('mongodb://127.0.0.1:27017/justcastles', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    const castle = new Castle({
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/KRAK_DES_CHEVALIERS_-_GAR_-_6-00.jpg/300px-KRAK_DES_CHEVALIERS_-_GAR_-_6-00.jpg',
        title: `Krak des Chevaliers`,
        location: `Al-Husn, Talkalakh District, Syria`,
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
        author: '6489b5d525792939958d8da1'
    })
    await castle.save();
};

seedDB().then(() => {
    mongoose.connection.close();
})