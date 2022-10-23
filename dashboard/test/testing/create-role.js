module.exports = { 
    Create: function (config = {}) {   
        const { url } = config
        describe('PTBC - CRM Create Role', () => {
            beforeAll(async () => {
                await page.goto(url)
            })

            // it('should display "PTBC - CRM Create role" text on page', async () => {
            //     await expect(page).toFillForm('form[name="role-edit"]', {
            //         UserName: 'testactive',
            //         UserId: 'mencoba',
            //         UserRole: 'make',
            //     })
            //     await expect(page).toClick('button', { text: 'Create' })
            // })
            
            it('should display "PTBC - CRM Success Create Role" text on page', async () => {
                await expect(page).toMatch('Success Create Role')
            })
        
        })
    }
}