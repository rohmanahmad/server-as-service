module.exports = { 
    Create: function (config = {}) {
        const { url } = config
        describe('PTBC - CRM Create User Access', () => {
            
            beforeAll(async () => {
                await page.goto(url)
            })
          
            it('should display "PTBC - CRM Create User Agen" text on page', async () => {
              await expect(page).toFillForm('form[name="user-create"]', {
                UserName: 'testactive',
                UserId: 'mencoba',
                UserRole: 'make',
              })
              await expect(page).toClick('button', { text: 'Submit' })
            })
            
            it('should display "PTBC - CRM User Access Success Create Agent" text on page', async () => {
              await expect(page).toMatch('Success Create Agen')
            })
          
          })
     }
}