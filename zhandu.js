import puppeteer from "puppeteer";
import fs from 'fs';

const getQuotes = async () => {

// pagination wala div = style__div-paginate___37OJx => ul with class = list-pagination => lists with number =>  numberOfLists - 2

// or anchor tags with class - link-page  

    // !document.querySelector('PageNotFound__image-cover___2DysO')

    
    // new site = https://www.1mg.com/drugs-all-medicines
    let i = 1;
    let loopCondition = true;
    let array = [];
    for(let i = 1; i < 10; i++){

        if(loopCondition) {

            const browser = await puppeteer.launch({
                headless: false,
                defaultViewport: null,
            });
            
            // Open a new page
            const page = await browser.newPage();
        
            await page.goto(`https://www.1mg.com/categories/ayurveda/top-brands/zandu-285?filter=true&pageNumber=${i}`, {
                waitUntil: "domcontentloaded",
            });
            // let fs = fs;
            // const fs = require('fs')


            // Get page data
            const itemDetails = await page.evaluate(() => {
                if(document.querySelector('PageNotFound__image-cover___2DysO')) {
                    loopCondition = false;
                    // break;
                    console.log("error is page not found ");
                } else {
                    const details = [];

                    const items = document.querySelectorAll(".style__product-box___liepi");
                    console.log("items are ", items);
                    
                    
                    const allItems = Array.from(items).map(item => {
                        console.log("item ", item);
                        const item_name = item.querySelector(".style__pro-title___2QwJy")?.innerText;
                        const mrp = item.querySelector(".style__discount-price___25Bya")?.innerText;
                        const rating = item.querySelector(".CardRatingDetail__weight-700___27w9q")?.innerText;
                        const totalRatings = item.querySelector(".CardRatingDetail__ratings-header___2yyQW")?.innerText;
                        const discount = item.querySelector(".style__off-badge___2JaF-")?.innerText;
                        const price = item.querySelector(".style__price-tag___cOxYc")?.innerText;
                        
                        return {item_name, mrp, rating, totalRatings, discount, price}
                    });
                    
                    return allItems;
                }
            });
            console.log('itemDetails are ', itemDetails);
            // }
            await browser.close();
            console.log('itemDetails are ', itemDetails);
            const jsonData = JSON.stringify(itemDetails, null, 2);
            fs.appendFileSync('items.json', jsonData);
        } else {
            break;
        }
    }
    // console.log('array ', array);
// }
}

// Start the scraping
getQuotes();