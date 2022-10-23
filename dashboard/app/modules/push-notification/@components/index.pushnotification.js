'use strict'

import forms from './forms/index.forms'
import modals from './modals/index.modals'
import FcmTokenList from './fcm-token-list.riot'
import PreviewAndroid from './preview-android.riot'
import PreviewIos from './preview-ios.riot'

export default {
    ...forms,
    ...modals,
    FcmTokenList,
    PreviewAndroid,
    PreviewIos,
}