module.exports = { 
    UnBlock: function (config = {}) { 
        const { url } = config
        describe('PTBC - CRM Unblock User Access', () => {
            
            beforeAll(async () => {
                await page.goto(url)
            })

            it('should display "PTBC - CRM User Access Input Notes Block" text on page', async () => {
                await expect(page).toFillForm('form[name="agen-form"]', {
                    searchAgent: 'active',
                })
                await expect(page).toClick('button', { text: 'Unblock' })
            })
          
            // it('should display "PTBC - CRM My User Access Unblock" text on page', async () => {
            //    await expect(page).toClick('button', { text: 'Unblock' })
            // })
          
            it('should display "PTBC - CRM User Access Unblock Confirm" text on page', async () => {
              await expect(page).toMatch('Are you sure?')
            })
          
            it('should display "PTBC - CRM My User Access Unblock Confirm" text on page', async () => {
              await expect(page).toClick('button', { text: 'Unblocks' })
            })
          
            it('should display "PTBC - CRM User Access Success Unblocked! " text on page', async () => {
              await expect(page).toMatch('UnBlocked!')
            })
          
          })
     }
}