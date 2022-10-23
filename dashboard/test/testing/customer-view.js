module.exports = { 
    View: function (config = {}) {
        const { url } = config
        describe('PTBC - CRM Customers View', () => {

            beforeAll(async () => {
              await page.goto(url)
            })
          
            // it('should display "PTBC - CRM Customer History" text on page', async () => {
            //   await expect(page).toClick('button', { text: 'View' })
            // })
            // it('should display "PTBC - CRM Customers View" text on page',async () => {
            //   await page.goto('http://localhost:3000/#/customers/view?userid=abdulrohman123')
            // })
            
            it('should display "PTBC - CRM Customer History" text on page', async () => {
              await expect(page).toClick('a', { text: 'Customer History' })
            })
            
            it('should display "PTBC - CRM Customers Block/Unblock History" text on page', async () => {
              await expect(page).toClick('a', { text: 'Block/Unblock History' })
            })
          })
    }
}