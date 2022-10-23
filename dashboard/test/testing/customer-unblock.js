module.exports = { 
    UnBlock: function (config = {}) {
      const { url } = config
        describe('PTBC - CRM Customers UnBlock ', () => {
            beforeAll(async () => {
              await page.goto(url)
            })

            it('should display "PTBC - CRM Customers Search " text on page', async () => {
                await expect(page).toFillForm('form[name="customers-form"]', {
                searchCustomers: 'abdulrohman123',
                })
                await expect(page).toClick('button', { text: 'Search' })
            })
          
            it('should display "PTBC - CRM Customers UnBlock" text on page', async () => {
              await expect(page).toClick('button .BlockListCustomer', { text: 'Unblock' })
            })
          
            it('should display "PTBC - CRM Customers Input Notes Unblock" text on page', async () => {
              await expect(page).toFillForm('form[name="form-block"]', {
                formBlock: 'Notes Request',
              })
              await expect(page).toClick('a', { text: 'Unblock' })
            })
          
            it('should display "PTBC - CRM Success input notes" text on page', async () => {
              await expect(page).toMatch('Unblock User ID')
            })
          
            it('should display "PTBC - CRM Customers Unblock" text on page', async () => {
              await expect(page).toClick('button', { text: 'Confirm' })
            })
          
            it('should display "PTBC - CRM Success Unblocked!" text on page', async () => {
              await expect(page).toMatch('UnBlocked!')
            })
            
            it('should display "PTBC - CRM Success UnBlocked Ok " text on page', async () => {
              await expect(page).toClick('button', { text: 'OK' })
            })
          }) 
    }
}