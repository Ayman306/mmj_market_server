class jobPostHelperClass {
    public job_detail = {
        id: '',
        title: '',
        company_name: '',
        description: '',
        responsibility: '',
        qualification: '',
        employment_type: '',
        salary_range: '',
        number_of_opening: '',
        apply_url: '',
        notes: '',
    }
    public contact_detail = {
        jobpost_id: '',
        primary_contact: '',
        alternative_contact: '',
        email: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        web_url: '',
        wa_number: '',
    }
}
export const jobPostHelper = new jobPostHelperClass()
