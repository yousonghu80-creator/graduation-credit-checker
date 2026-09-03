const graduationRequirements = {

  university: "東洋大学",
  faculty: "理工学部",
  department: "機械工学科",
  admissionYear: 2024,

  // 卒業条件
  graduation: {

    total: 124,

    basicEducation: {
      total: 20,
      philosophy: 2,
      international: 8,
      foreignLanguage: 6,
      technicalEnglishRequired: 4,
      technicalEnglishElective: 2
    },

    scienceFoundation: {
      total: 20,

      mathematics: {
        required: 6,
        requiredElective: 3
      },

      physics: {
        required: 2,
        requiredElective: 4
      },

      chemistry: {
        minimum: 2
      },

      information: {
        required: 1
      }
    },

    professional: {
      total: 70,
      required: 15,
      requiredElective: 24,
      coreCredits: 8,
      coreSubjects: 4
    }

  },

  // 卒着条件
  eligibility: {

    total: 104,

    basicEducation: 18,

    international: 6,

    foreignLanguage: 6,

    technicalEnglishRequired: 4,

    technicalEnglishElective: 2,

    scienceFoundation: 20,

    professional: {
      total: 53,
      required: 7,
      requiredElective: 24,
      coreCredits: 8,
      coreSubjects: 4
    }

  }

};