module.exports = { 
    Logins: function (config = {}) {
        const { url } = config
        describe('PTBC - CRM Login', () => {
            beforeAll(async () => {
                await page.goto(url)
            })
        
            it('should display "PTBC - CRM Form login" text on page', async () => {
                await expect(page).toMatch('Sign In')
            })

            it('should display "PTBC - CRM Proses login" text on page', async () => {
                await expect(page).toFillForm('form[name="login-form"]', {
                    username: 'ptbcsuper',
                    password: 'asdasdasd',
                })
                await expect(page).toClick('button', { text: 'Sign In' })
            })

            it('should display "PTBC - CRM Success login " text on page', async () => {
                await expect(page).toMatch('Search')
            })
        })
    }

}