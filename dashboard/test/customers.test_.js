
describe('PTBC - CRM', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/#/customers')
  })

/*    login  */

  it('should display "PTBC - CRM Form login" text on page', async () => {
    // await expect(page).toMatch('PTBC - CRM')
    // Assert that a form will be filled
    await expect(page).toMatch('Sign In')
  })
  
  it('should display "PTBC - CRM Proses login" text on page', async () => {
    await expect(page).toFillForm('form[name="login-form"]', {
      username: 'adminactive',
      password: 'punt3n',
    })
    await expect(page).toClick('button', { text: 'Sign In' })
    // await expect(page).toMatch('Search')
  })

  it('should display "PTBC - CRM Success login " text on page', async () => {
    // Assert that a form will be filled
    await expect(page).toMatch('Search')
  })

   /* start customers */

  // it('should display "PTBC - CRM Customers Search " text on page', async () => {
  //   await expect(page).toFillForm('form[name="customers-form"]', {
  //     searchCustomers: 'abdulrohman123',
  //   })
  //   await expect(page).toClick('button', { text: 'Search' })
  // })
  

  /*  request block in customers */

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
    await expect(page).toClick('button', { text: 'Blocks' })
  })

  it('should display "PTBC - CRM Success Blocked!" text on page', async () => {
    await expect(page).toMatch('Blocked!')
  })

  it('should display "PTBC - CRM Success Blocked Ok " text on page', async () => {
    await expect(page).toClick('button', { text: 'OK' })
  })

})
 
   /* request unblock In customers  */

describe('PTBC - CRM', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/#/customers')
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
    await expect(page).toClick('button', { text: 'Unblocks' })
  })

  it('should display "PTBC - CRM Success Unblocked!" text on page', async () => {
    await expect(page).toMatch('UnBlocked!')
  })
  
  it('should display "PTBC - CRM Success UnBlocked Ok " text on page', async () => {
    await expect(page).toClick('button', { text: 'OK' })
  })
}) 
  /*  customer view */
describe('PTBC - CRM', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/#/customers')
  })

  it('should display "PTBC - CRM Customer History" text on page', async () => {
    await expect(page).toClick('button', { text: 'View' })
  })
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

  /*  pending task Approve */

describe('PTBC - CRM', () => {
  it('should display "PTBC - CRM My Pending Tasks Approve" text on page', async () => {
    await page.goto('http://localhost:3000/#/task/pendings')
  })

  it('should display "PTBC - CRM My Pending Tasks Approve" text on page', async () => {
    await expect(page).toClick('button', { text: 'Approve' })
  })
  
  it('should display "PTBC - CRM Success MESSAGE PREVIEW APPROVE" text on page', async () => {
    await expect(page).toMatch('MESSAGE PREVIEW APPROVE')
  })
  
  it('should display "PTBC - CRM My Pending Tasks Approve Comfirm" text on page', async () => {
    await expect(page).toClick('a', { text: 'Approved' })
  })
  
  it('should display "PTBC - CRM Success Approved " text on page', async () => {
    await expect(page).toMatch('Success Approved Button')
  })

  it('should display "PTBC - CRM Success Approved Ok " text on page', async () => {
    await expect(page).toClick('button', { text: 'OK' })
  })
})

  /* Reject Pending Task */

describe('PTBC - CRM', () => {
  it('should display "PTBC - CRM My Pending Tasks Reject" text on page', async () => {
    await page.goto('http://localhost:3000/#/task/pendings')
  })
  it('should display "PTBC - CRM My Pending Tasks Reject" text on page', async () => {
    await expect(page).toClick('button', { text: 'Reject' })
  })

  it('should display "PTBC - CRM Success Message Preview Reject" text on page', async () => {
    await expect(page).toMatch('Message Preview Reject')
  })
  
  it('should display "PTBC - CRM My Pending Tasks Reject Comfirm" text on page', async () => {
    await expect(page).toClick('a', { text: 'Rejects' })
  })
  
  it('should display "PTBC - CRM Success Reject " text on page', async () => {
    await expect(page).toMatch('Success Reject Button')
  })

  it('should display "PTBC - CRM Success Reject Ok " text on page', async () => {
    await expect(page).toClick('button', { text: 'OK' })
  })
})

   /* start user accer Change*/ 

describe('PTBC - CRM', () => {
 it('should display "PTBC - CRM My User Access Change" text on page', async () => {
      await page.goto('http://localhost:3000/#/user/access')
  })
    
   it('should display "PTBC - CRM My User Access Change" text on page', async () => {
    await expect(page).toClick('button', { text: 'Change' })
  })

  it('should display "PTBC - CRM Change Form Input" text on page', async () => {
    await expect(page).toMatch('Message Change User')
  })
  
  it('should display "PTBC - CRM Save My User Access Change" text on page', async () => {
    await expect(page).toClick('button', { text: 'Save' })
  })
})

   /* start user accer Block*/ 

describe('PTBC - CRM', () => {
  it('should display "PTBC - CRM My User Access Block" text on page', async () => {
    await page.goto('http://localhost:3000/#/user/access')
  })

  it('should display "PTBC - CRM My User Access Block" text on page', async () => {
    await expect(page).toClick('button', { text: 'Block' })
  })

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

/* start user accer Delete*/ 

describe('PTBC - CRM', () => {
    it('should display "PTBC - CRM My User Access Delete" text on page', async () => {
      await page.goto('http://localhost:3000/#/user/access')
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

describe('PTBC - CRM', () => {
  it('should display "PTBC - CRM My User Access Create" text on page', async () => {
    await page.goto('http://localhost:3000/#/user/create')
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

  it('should display "PTBC - CRM debug" text on page', async () => {
    await jestPuppeteer.debug()
  })

})
