# contacts/PetitionerTrustContact(INTERNATIONAL)
 ```
---
  type: "object"
  keys: 
    country: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "max"
          args: 
            limit: 500
    countryType: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      allow: 
        - "international"
    address1: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "max"
          args: 
            limit: 100
    address2: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "max"
          args: 
            limit: 100
    address3: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "max"
          args: 
            limit: 100
    city: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "max"
          args: 
            limit: 100
    contactId: 
      type: "string"
      flags: 
        presence: "required"
        description: "Unique contact ID only used by the system."
      rules: 
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
    inCareOf: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "max"
          args: 
            limit: 100
    name: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "max"
          args: 
            limit: 100
    phone: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "max"
          args: 
            limit: 100
    secondaryName: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "max"
          args: 
            limit: 500
    title: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "max"
          args: 
            limit: 100
    serviceIndicator: 
      type: "string"
      flags: 
        only: true
        presence: "optional"
      allow: 
        - "Electronic"
        - "None"
        - "Paper"
    hasEAccess: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "Flag that indicates if the contact has \"eAccess\" login credentials to the legacy system."
    email: 
      type: "string"
      rules: 
        - 
          name: "email"
          args: 
            options: 
              tlds: false
        - 
          name: "max"
          args: 
            limit: 100
      whens: 
        - 
          ref: 
            path: 
              - "hasEAccess"
          is: 
            type: "any"
            flags: 
              only: true
              presence: "required"
            allow: 
              - 
                override: true
              - true
          then: 
            type: "any"
            flags: 
              presence: "required"
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
    postalCode: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "max"
          args: 
            limit: 100

 ```