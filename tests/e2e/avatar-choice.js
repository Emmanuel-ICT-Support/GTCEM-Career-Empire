// Old body IDs remain editable under the explicitly opened test section.
export async function selectTestCharacter(page,body){
 await page.getByText('Test characters',{exact:true}).click();
 await page.getByLabel('Test character',{exact:true}).selectOption(body);
}
