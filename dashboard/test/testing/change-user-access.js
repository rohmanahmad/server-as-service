module.exports = { 
    Change: function (config = {}) {  
        const { url } = config        
        describe('PTBC - CRM Change User Access', () => {
            
            beforeAll(async () => {
                await page.goto(url)
            })

            it('should display "PTBC - CRM Customers Input Notes Block" text on page', async () => {
              await expect(page).toFillForm('form[name="agen-form"]', {
                  searchAgent: 'active',
              })
              // await expect(page).toClick('button', { text: 'Change' })
            })
               
            it('should display "PTBC - CRM My User Access Change" text on page', async () => {
               await expect(page).toClick('button', { text: 'Change' })
             })
           
            it('should display "PTBC - CRM Change Form Input" text on page', async () => {
              await expect(page).toMatch('Change User')
            })
            
            it('should display "PTBC - CRM Save My User Access Change" text on page', async () => {
              await expect(page).toFillForm('form[name="change-agent"]', {
                userid: 'active',
                role:'maker'
              })
              await expect(page).toClick('button', { text: 'Save' })
            })

              // it('should display "PTBC - CRM debug" text on page', async () => {
              //   await jestPuppeteer.debug()
              // })

           })
           
     }
}