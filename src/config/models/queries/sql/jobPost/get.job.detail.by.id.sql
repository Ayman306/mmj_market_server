SELECT 
    json_build_object(
        'job_detail', json_build_object(
            'id', jobpost.id,
            'title', jobpost.title,
            'company_name', jobpost.company_name,
            'description', jobpost.description,
            'responsibility', jobpost.responsibility,
            'qualification', jobpost.qualification,
            'employment_type', jobpost.employment_type,
            'salary_range', jobpost.salary_range,
            'number_of_opening', jobpost.number_of_opening,
            'apply_url', jobpost.apply_url,
            'notes', jobpost.notes,
            'media',jobpost.media,
            'created_date',jobpost.created_date
        ),
        'contact_detail', json_build_object(
            'id',contact.id,
            'jobpost_id', jobpost.id,
            'contact_available', true, -- Assuming contact is available if a contact record exists
            'primary_contact', contact.primary_contact,
            'alternative_contact', contact.alternative_contact,
            'email', contact.email,
            'address', contact.address,
            'city', contact.city,
            'state', contact.state,
            'pincode', contact.pincode,
            'geo_location',contact.geo_location,
            'web_url', contact.web_url
        )
    ) AS jobpost
FROM 
    jobpost 
JOIN 
    contact ON jobpost.id = contact.jobpost_id where jobpost.status = true and jobpost.id=$1;