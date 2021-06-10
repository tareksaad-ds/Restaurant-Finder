import * as dotenv from "dotenv";
import express from "express";
import * as db from "./db/index.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
// GET ALL RESTAURANTS
app.get("/api/v1/restaurants", async (req, res) => {
  try {
    //const results = await db.query("select * from restaurants");
    const ratingData = await db.query(
      "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id;"
    );
    res.status(200).json({
      status: "success",
      results: ratingData.rows.length,
      data: {
        restaurants: ratingData.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

//GET A RESTAURANT
app.get("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const restaurant = await db.query(
      //`select * from restaurants where id= ${req.params.id} `
      "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id = $1;",
      [req.params.id]
    );
    const reviews = await db.query(
      `select * from reviews where restaurant_id= ${req.params.id} `
    );
    res.status(200).json({
      status: "success",
      data: {
        restaurants: restaurant.rows[0],
        reviews: reviews.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

//CREATE A RESTAURANT
app.post("/api/v1/restaurants", async (req, res) => {
  try {
    const { name, location, price_range } = req.body;
    const results = await db.query(
      "INSERT INTO restaurants (name , location , price_range) values ($1 , $2 , $3) returning *",
      [name, location, price_range]
    );
    res.status(201).json({
      status: "success",
      data: {
        restaurants: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// UPDATE A RESTAURANT
app.put("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const results = await db.query(
      "UPDATE restaurants SET name = $1, location = $2, price_range = $3 where id = $4 returning *",
      [req.body.name, req.body.location, req.body.price_range, req.params.id]
    );

    res.status(200).json({
      status: "succes",
      data: {
        restaurants: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// DELETE A RESTAURANT

app.delete("/api/v1/restaurants/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM restaurants where id = $1", [req.params.id]);
    res.status(204).json({ status: "success" });
  } catch (err) {
    console.log(err);
  }
});

// ADD A REVIEW
app.post("/api/v1/restaurants/:id/review", async (req, res) => {
  try {
    const newReview = await db.query(
      "INSERT INTO reviews (restaurant_id, name , review , rating) values ($1 , $2 , $3 , $4); ",
      [req.params.id, req.body.name, req.body.review, req.body.rating]
    );
    res.status(201).json({
      status: "success",
      data: {
        review: newReview.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

const port = process.env.PORT || 3006;
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
