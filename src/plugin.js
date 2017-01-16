/* vuex-i18n defines the Vuexi18nPlugin to enable localization using a vuex
** module to store the translation information. Make sure to also include the
** file vuex-i18n-store.js to include a respective vuex module.
*/

// initialize the plugin object
export default {
  // internationalization plugin for vue js using vuex
  install(Vue, store, moduleName = 'i18n', transFunct = '$t') {

    // check if the plugin was correctly initialized
    if (!store.state.hasOwnProperty(moduleName)) {
      console.error('i18n vuex module is not correctly initialized. Please check the module name:', moduleName);

      // always return the key if module is not initialized correctly
      Vue.prototype.$i18n = key => key

      Vue.prototype.$getLanguage = () => null

      Vue.prototype.$setLanguage = () => {
        console.error('i18n vuex module is not correctly initialized');
      }

      return
    }

    // get localized string from store
    const translate = (key, options) => {

      // get the current language from the store
      const locale = store.state[moduleName].locale

      // check if the language exists in the store. return the key if not
      if (!store.state[moduleName].translations.hasOwnProperty(locale)) {
        return render(key, options);
      }

      // check if the key exists in the store. return the key if not
      if (!store.state[moduleName].translations[locale].hasOwnProperty(key)) {
        console.warn('Key not found:', key)

        return render(key, options);
      }

      // return the value from the store
      return render(store.state[moduleName].translations[locale][key], options)
    };


    const setLocale = locale => {
      store.dispatch({
        type: 'setLocale',
        locale
      })
    }

    const getLocale = () => store.state[moduleName].locale

    // add predefined translations to the store
    const addLocale = (locale, translations) => {
      return store.dispatch({
        type: 'addLocale',
        locale,
        translations
      })
    }

    // remove the givne locale from the store
    const removeLocale = locale => {
      if (store.state[moduleName].translations.hasOwnProperty(locale)) {
        store.dispatch({
          type: 'removeLocale',
          locale
        })
      }
    }

    // check if the given locale is already loaded
    const checkLocaleExists = locale => {
      return store.state[moduleName].translations.hasOwnProperty(locale)
    }

    // register vue prototype methods
    Vue.prototype.$i18n = {
      locale: getLocale,
      set: setLocale,
      add: addLocale,
      remove: removeLocale,
      exists: checkLocaleExists
    };

    // register global methods
    Vue.i18n = {
      locale: getLocale,
      set: setLocale,
      add: addLocale,
      remove: removeLocale,
      exists: checkLocaleExists,
      translate: translate
    };

    // register the translation function on the vue instance
    Vue.prototype[transFunct] = translate

    // register a filter function for translations
    Vue.filter('translate', translate)

  }
}


// will replace the given replacements in the translation string
const replace = (translation, replacements, warn = true) => {

	// check if the object has a replace property
	if (!translation.replace) {
		return translation
	}

	return translation.replace(/\{\w+\}/g, placeholder => {

		const key = placeholder.replace('{', '').replace('}', '')

		if (replacements[key] !== undefined) {
			return replacements[key]
		}

		// warn user that the placeholder has not been found
		if (warn === true) {
			console.group('Not all placeholder founds')
			console.warn('Text:', translation)
			console.warn('Placeholder:', placeholder)
			console.groupEnd()
		}

		// return the original placeholder
		return placeholder
	})
}

// render will return the given translation object
const render = (translation, replacements = {}) => {

	// get the type of the property
	const objType = typeof translation

	if (isArray(translation)) {

		// replace the placeholder elements in all sub-items
		return translation.map(item => replace(item, replacements, false))

	} else if (objType === 'string') {
		return replace(translation, replacements)
	}

	// return translation item directly
	return translation
}

// check if the given object is an array
const isArray = obj => !!obj && Array === obj.constructor
