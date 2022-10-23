module.exports = { 
    Block: function (config = {}) { 
        const { url } = config
        describe('PTBC - CRM Block User Access', () => {
            
            beforeAll(async () => {
                await page.goto(url)
            })

            it('should display "PTBC - CRM Customers Input Notes Block" text on page', async () => {
              await expect(page).toFillForm('form[name="agen-form"]', {
                  searchAgent: 'active',
              })
              await expect(page).toClick('button', { text: 'Block' })
            })
          
            // it('should display "PTBC - CRM My User Access Block" text on page', async () => {
            //   await expect(page).toClick('button', { text: 'Block' })
            // })
          
            it('should display "PTBC - CRM User Access Block Confirm" text on page', async () => {
              await expect(page).toMatch('Are you sure?')
            })
          
            it('should display "PTBC - CRM My User Access Block Confirm" text on page', async () => {
              await expect(page).toClick('button', { text: 'Blocks' })
            })
          
            it('should display "PTBC - CRM User Access Success Blocked! " text on page', async () => {
              await expect(page).toMatch('Blocked!')
            })
          
          })
     }
}