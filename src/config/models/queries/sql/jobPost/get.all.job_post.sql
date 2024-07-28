SELECT 
    json_build_object(
        'job_detail', json_build_object(
            'id', jobpost.id,
            'title', jobpost.title,
            'company_name', jobpost.company_name,
            'description', jobpost.description,
            'responsibility', jobpost.responsibility,
            'employment_type', jobpost.employment_type,
            'media',jobpost.media,
            'created_date',jobpost.created_date
        ),
        'contact_details', json_build_object(
            'id',contact.id,
            'jobpost_id', jobpost.id,
            'contact_available', true,
            'address', contact.address,
            'city', contact.city,
            'state', contact.state,
            'primary_contact', contact.primary_contact            
        )
    ) AS jobpost
FROM 
    jobpost 
JOIN 
    contact ON jobpost.id = contact.jobpost_id where jobpost.status = true ;