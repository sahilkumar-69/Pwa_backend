import axios from "axios";
import fs from "fs";

const API_KEY = "X38wmMjWkIKFD1Aou3BimXvOJmHGfAv5z83YFDZlnOVkGxKM7RdMvqDQ"; // 🔑 replace with your key
const meals = [
  "Pizza",
  "Burger",
  "Pasta",
  "Biryani",
  "Sushi",
  "Tacos",
  "Noodles",
  "Sandwich",
  "Fried Rice",
  "Shawarma",
  "Salad",
  "Soup",
  "Steak",
  "Kebab",
  "Curry",
  "Hot Dog",
  "Pancakes",
  "Ice Cream",
  "Donut",
  "Falafel",
];

async function fetchImages() {
  let results = [];

  for (const meal of meals) {
    try {
      const url = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(
        meal
      )}&image_type=photo&per_page=3`;

      const res = await axios.get(url);
      const hits = res.data.hits;

      if (hits.length > 0) {
        results.push({
          meal,
          images: hits.slice(0, 3).map((h) => h.largeImageURL), // take 3 imgs per meal
        });
      } else {
        results.push({ meal, images: [] });
      }
    } catch (err) {
      console.error(`Error fetching for ${meal}:`, err.message);
    }
  }

  // save results into a JSON file
  fs.writeFileSync("mealImages.json", JSON.stringify(results, null, 2));
  console.log("✅ Image links saved to mealImages.json");
}

fetchImages();
