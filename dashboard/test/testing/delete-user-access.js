module.exports = { 
    Delete: function (config = {}) { 
        const { url } = config
        describe('PTBC - CRM Delete User Access', () => {
            
            beforeAll(async () => {
               await page.goto(url)
            })

            it('should display "PTBC - CRM Customers Input Notes Block" text on page', async () => {
              await expect(page).toFillForm('form[name="agen-form"]', {
                  searchAgent: 'suketi',
              })
            })
 
            it('should display "PTBC - CRM My User Access Delete" text on page', async () => {
              await expect(page).toClick('button', { text: 'Delete' })
            })
        
            it('should display "PTBC - CRM User Access Delete Confirm" text on page', async () => {
              await expect(page).toMatch('Are you sure?')
            })
          
            it('should display "PTBC - CRM My User Access Delete Confirm" text on page', async () => {
              await expect(page).toClick('button', { text: 'Deleted' })
            })
        
            it('should display "PTBC - CRM User Access Success Deleted! " text on page', async () => {
              await expect(page).toMatch('Deleted!')
            })
        })
    }
}