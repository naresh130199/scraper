import puppeteer from "puppeteer";
import fs from "fs";

const getQuotes = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });
  let itemsWithCompleteDetails = [];
  let iteration = 0;

  let letters = ["a"];
  console.log("hello sir");

  for (let letter = 0; letter < letters.length; letter++) {
    for (let i = 50; i < 80; i++) {
      // page 50 tak kiya hai, next from 50 to 334 and do this for every letter
      console.log("iteration is ", iteration);
      iteration++;
      const page = await browser.newPage();
      await page.goto(
        `https://www.1mg.com/drugs-all-medicines?page=${i + 1}&label=${
          letters[letter]
        }`,
        {
          waitUntil: "domcontentloaded",
          timeout: 600000000,
        }
      );
      // Get page data
      const itemDetails = await page.evaluate(() => {
        console.log("hello in browser");
        const items = document.getElementsByClassName(
          "style__product-name___HASYw"
        );

        const allItems = Array.from(items).map((item) => {
          const url = item.getAttribute("href");
          console.log("item is ", item);
          console.log("url ", url);

          let name = item
            .querySelector(".style__font-normal___2gZqF")
            ?.parentElement?.previousSibling?.textContent?.trim();
          let mrp = item
            .querySelector(".style__font-normal___2gZqF")
            ?.parentElement?.textContent?.split("₹")[1];
          let rxRequired =
            item.querySelector(".style__rx___3pKXG")?.textContent;
          let productDetails = item.querySelector(
            ".style__flex-column___1zNVy"
          );
          let productContent = item
            .querySelector(".style__display-table___226Zq")
            ?.children[0]?.textContent?.trim();

          let number = productDetails.children[0]?.textContent;
          let manufacturer = productDetails.children[1]?.textContent;

          return {
            name,
            mrp,
            rxRequired,
            uom: number,
            manufacturer,
            salt: productContent,
            url,
          };
        });
        return allItems;
      });
      for (let item of itemDetails) {
        try {
          await page.goto(`https://www.1mg.com${item.url}`, {
            waitUntil: "domcontentloaded",
            timeout: 6000000,
          });
          const pageData = await page.evaluate(() => {
            const moreData = {};
            moreData.introduction = document
              .querySelector("#overview")
              ?.innerText?.replace(/\n/g, " ");

            moreData.uses = document
              .querySelector("#uses_and_benefits")
              ?.innerText?.replace(/\n/g, " ");

            moreData.sideEffects = document
              .querySelector("#side_effects")
              ?.innerText?.replace(/\n/g, " ");

            moreData.directions = document
              .querySelector("#how_to_use")
              ?.innerText?.replace(/\n/g, " ");

            moreData.working = document
              .querySelector("#how_drug_works")
              ?.innerText?.replace(/\n/g, " ");

            moreData.warnings = document
              .querySelector("#safety_advice")
              ?.innerText?.replace(/\n/g, " ");

            moreData.missedDose = document
              .querySelector("#missed_dose")
              ?.innerText?.replace(/\n/g, " ");

            moreData.substitutes = document
              .querySelector("#substitutes")
              ?.innerText?.replace(/\n/g, " ");

            moreData.advice = document
              .querySelector("#expert_advice")
              ?.innerText?.replace(/\n/g, " ");

            moreData.facts = document
              .querySelector("#fact_box")
              ?.innerText?.replace(/\n/g, " ");

            moreData.faqs = document
              .querySelector("#faq")
              ?.innerText?.replace(/\n/g, " ");

            moreData.references = document
              .querySelector("#reference-GA")
              ?.innerText?.replace(/\n/g, " ");

            moreData.marketerDetails = document
              .querySelector(".DrugPage__compliance-info-wrapper___Wjcw8")
              ?.innerText?.replace(/\n/g, " ");

            moreData.price = document.querySelector(
              ".DrugPriceBox__best-price___32JXw"
            )?.innerText;
            console.log("moreData ", moreData);
            return moreData;
          });
          itemsWithCompleteDetails.push({ ...item, ...pageData });
        } catch (err) {
          console.log("error is ", err);
          console.log("itemsWithCompleteDetails is ", itemsWithCompleteDetails);
          browser.close();
          return err;
        }
      }
    }
  }

  await browser.close();
  console.log("itemsWithCompleteDetails ", itemsWithCompleteDetails);
  const jsonData = JSON.stringify(itemsWithCompleteDetails, null, 2);
  fs.appendFileSync("dataWithMoreDetails.json", jsonData);
};

getQuotes();
