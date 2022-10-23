module.exports = { 
    Edit: function (config = {}) {   
        const { url } = config
        describe('PTBC - CRM Edit Role', () => {
            beforeAll(async () => {
                await page.goto(url)
            })
           
            
            // it('should display "PTBC - CRM Create role" text on page', async () => {
            //     await expect(page).toFillForm('form[name="role-create"]', {
            //         UserName: 'testactive',
            //         UserId: 'mencoba',
            //         UserRole: 'make',
            //     })
            //     await expect(page).toClick('button', { text: 'Update' })
            // })
            
            it('should display "PTBC - CRM Success Create Role" text on page', async () => {
                await expect(page).toMatch('Success Update Role')
            })
        })
    }
}