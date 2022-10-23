module.exports = { 
    Block: function (config = {}) {
        const { url } = config
        describe('PTBC - CRM Customers Block', () => {
            beforeAll(async () => {
                await page.goto(url)
            })

            it('should display "PTBC - CRM Customers Search " text on page', async () => {
                await expect(page).toFillForm('form[name="customers-form"]', {
                searchCustomers: 'abdulrohman123',
                })
                await expect(page).toClick('button', { text: 'Search' })
            })

            it('should display "PTBC - CRM Customers Block" text on page', async () => {
                await expect(page).toClick('button .BlockListCustomer', { text: 'Block' })
            })
        
            it('should display "PTBC - CRM Customers Input Notes Block" text on page', async () => {
                await expect(page).toFillForm('form[name="form-block"]', {
                formBlock: 'Notes Request',
                })
                await expect(page).toClick('a', { text: 'Block' })
            })
            
            it('should display "PTBC - CRM Success input notes" text on page', async () => {
                await expect(page).toMatch('Block User ID')
            })
        
            it('should display "PTBC - CRM Customers Block" text on page', async () => {
                await expect(page).toClick('button', { text: 'Confirm' })
            })
        
            it('should display "PTBC - CRM Success Blocked!" text on page', async () => {
                await expect(page).toMatch('Blocked!')
            })
        
            it('should display "PTBC - CRM Success Blocked Ok " text on page', async () => {
                await expect(page).toClick('button', { text: 'OK' })
            })

            // it('should display "PTBC - CRM debug" text on page', async () => {
            //     await jestPuppeteer.debug()
            // })
        })
    }   
}