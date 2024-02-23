import puppeteer from "puppeteer";
import fs from 'fs';

const getQuotes = async () => {

// pagination wala div = style__div-paginate___37OJx => ul with class = list-pagination => lists with number =>  numberOfLists - 2

// or anchor tags with class - link-page  

    // !document.querySelector('PageNotFound__image-cover___2DysO')

    // info containing main div = style__flex-1___A_qoj



    // main anchor = style__product-name___HASYw
    // <a href="/drugs/lenvima-4mg-capsule-467025" target="_blank" rel="noopener" class="button-text style__flex-row___2AKyf style__flex-1___A_qoj style__product-name___HASYw"><div class="style__card-image___1oz_4"><img src="https://onemg.gumlet.io/a_ignore,w_380,h_380,c_fit,q_auto,f_auto/hx2gxivwmeoxxxsc1hix.png" alt="Lenvima 4mg Capsule"></div><div class="style__flex-1___A_qoj"><div class="style__font-bold___1k9Dl style__font-14px___YZZrf style__flex-row___2AKyf style__space-between___2mbvn style__padding-bottom-5px___2NrDR"><div>Lenvima 4mg Capsule</div><div><span class="style__font-normal___2gZqF style__margin-left-8px___3Sw1d">MRP</span>₹11770</div></div><div class="style__rx___3pKXG style__font-12px___2ru_e"><img src="https://onemg.gumlet.io/w_20,h_20/q_auto,f_auto/rx_icon.png" alt="Prescription Required"><span>Prescription Required</span></div><div class="style__flex-column___1zNVy style__font-12px___2ru_e"><div class="style__padding-bottom-5px___2NrDR">strip of 10 capsules</div><div class="style__padding-bottom-5px___2NrDR">Eisai Pharmaceuticals India Pvt Ltd</div></div><div class="style__padding-bottom-5px___2NrDR style__display-table___226Zq"><div class="style__font-12px___2ru_e style__product-content___-5PFBW style__display-inline-block___2y7gd">Lenvatinib (4mg)</div><div class="style__font-14px___YZZrf style__font-bold___1k9Dl style__add-to-cart___2b_Uo style__cursor-pointer___1SGKH style__display-inline-block___2y7gd"><div class="style__therapeutic___27GjI style__cart-button___3CZnL"><div class="style__interaction___3cb12">ADD</div></div></div></div></div></a>



    // first child of this has a div, which has the medicine name , and second has mrp - style__space-between___2mbvn



    // first div has number , second has marketer - style__flex-column___1zNVy
    // <div class="style__flex-column___1zNVy style__font-12px___2ru_e"><div class="style__padding-bottom-5px___2NrDR">strip of 10 capsules</div><div class="style__padding-bottom-5px___2NrDR">Eisai Pharmaceuticals India Pvt Ltd</div></div>


    // first div inside of it has compound name - style__display-table___226Zq
    // <div class="style__padding-bottom-5px___2NrDR style__display-table___226Zq"><div class="style__font-12px___2ru_e style__product-content___-5PFBW style__display-inline-block___2y7gd">Lenvatinib (4mg)</div><div class="style__font-14px___YZZrf style__font-bold___1k9Dl style__add-to-cart___2b_Uo style__cursor-pointer___1SGKH style__display-inline-block___2y7gd"><div class="style__therapeutic___27GjI style__cart-button___3CZnL"><div class="style__interaction___3cb12">ADD</div></div></div></div>


    // let letters = ['a','b'];
    let letters = ['a'];
    let loopCondition = true;
    for(let letter = 0; letter < letters.length; letter++){
        // for(let i = 1; i < 335; i++){
        for(let i = 1; i < 2; i++){

            if(loopCondition) {
                const browser = await puppeteer.launch({
                    headless: true,
                    defaultViewport: null,
                });
                
                // Open a new page
                const page = await browser.newPage();
            
                await page.goto(`https://www.1mg.com/drugs-all-medicines?page=${i}&label=${letters[letter]}`, {
                    waitUntil: "domcontentloaded",
                });
                // Get page data
                const itemDetails = await page.evaluate(() => {
                    if(document.querySelector('PageNotFound__image-cover___2DysO')) {
                        loopCondition = false;
                        // break;
                        console.log("error is page not found ");
                    } else {
                        let details = [];
                        // const allItems = [];

                        // const items = document.querySelectorAll(".style__product-box___liepi");
                        // const items = document.querySelectorAll(".style__product-card___1gbex");
                        // const items = document.getElementsByClassName('style__product-name___HASYw');
                        const items = document.getElementsByClassName('.style__product-name___HASYw');
                        console.log("items are ", items);
                        
                        
                        // const itemsArray = Array.from(items);
                        // for(const item of itemsArray){
                        const allItems = Array.from(items).map(item => {
                            const url = item.getAttribute('href');
                            console.log('item is ', item);
                            console.log("url ", url);
                            // await page.goto(`https://www.1mg.com${url}`, {
                            //     waitUntil: "domcontentloaded",
                            // });
                            // const data = await page.evaluate(() => {
                            //     const moreData = {};
                            //     moreData.introduction = document.querySelector('#overview')?.innerText?.replace(/\n/g, ' ');
                            //     moreData.uses = document.querySelector('#uses_and_benefits')?.innerText?.replace(/\n/g, ' ');
                            //     moreData.sideEffects = document.querySelector('#side_effects')?.innerText?.replace(/\n/g, ' ');
                            //     moreData.directions = document.querySelector('#how_to_use')?.innerText?.replace(/\n/g, ' ');
                            //     moreData.working = document.querySelector('#how_drug_works')?.innerText?.replace(/\n/g, ' ');
                            //     moreData.warnings = document.querySelector('#safety_advice')?.innerText?.replace(/\n/g, ' ');
                            //     moreData.missedDose = document.querySelector('#missed_dose')?.innerText?.replace(/\n/g, ' ');
                            //     moreData.substitutes = document.querySelector('#substitutes')?.innerText?.replace(/\n/g, ' ');
                            //     moreData.advice = document.querySelector('#expert_advice')?.innerText?.replace(/\n/g, ' ');
                            //     moreData.facts = document.querySelector('#fact_box')?.innerText?.replace(/\n/g, ' ');
                            //     moreData.advice = document.querySelector('#expert_advice')?.innerText?.replace(/\n/g, ' ');
                            //     moreData.faqs = document.querySelector('#faq')?.innerText?.replace(/\n/g, ' ');
                            //     moreData.references = document.querySelector('#reference-GA')?.innerText?.replace(/\n/g, ' ');
                            //     moreData.marketerDetails = document.querySelector('.DrugPage__compliance-info-wrapper___Wjcw8')?.innerText?.replace(/\n/g, ' ');
                            //     moreData.price = document.querySelector('.DrugPriceBox__best-price___32JXw')?.innerText;
                                
                            //     return moreData;
                            // })

                            // console.log("data is ", data);


                            let name = item.querySelector('.style__font-normal___2gZqF')?.parentElement?.previousSibling?.textContent?.trim()
                            var mrp = item.querySelector('.style__font-normal___2gZqF')?.parentElement?.textContent?.split('₹')[1]; 
                            var rxRequired = item.querySelector('.style__rx___3pKXG')?.textContent;
                            var productDetails = item.querySelector('.style__flex-column___1zNVy');
                            var productContent = item.querySelector('.style__display-table___226Zq')?.children[0]?.textContent?.trim();

                            var number = productDetails.children[0]?.textContent;
                            var marketer = productDetails.children[1]?.textContent;                            
                            
                            return {item_name : name, mrp, rxRequired, quantity : number, marketer, productContent}
                            // details.push({item_name : name, mrp, rxRequired, quantity : number, marketer, productContent});
                            // return 
                        });
                        return allItems;
                    }
                });
                await browser.close();
                console.log("page is ", i);
                console.log("itemDetails ", itemDetails);
                const jsonData = JSON.stringify(itemDetails, null, 2);
                fs.appendFileSync('newJson.json', jsonData);
            } else {
                console.log('break ');
                break;
            }
        }
    }
}

// Start the scraping
getQuotes();