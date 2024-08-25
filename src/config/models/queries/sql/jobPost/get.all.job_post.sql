SELECT 
    json_build_object(
        'job_detail', json_build_object(
            'id', jobpost.id,
            'title', jobpost.title,
            'company_name', jobpost.company_name,
            'employment_type', jobpost.employment_type,
            'media', jobpost.media,            
            'created_date', jobpost.created_date,
            'status', jobpost.status
        ),
        'contact_detail', json_build_object(
            'id', contact.id,
            'jobpost_id', jobpost.id,
            'contact_available', true,            
            'city', contact.city,
            'state', contact.state,
            'primary_contact', contact.primary_contact            
        )
    ) AS jobpost
FROM 
    jobpost 
JOIN 
    contact ON jobpost.id = contact.jobpost_id 
WHERE 
    (CASE 
        WHEN ${status}::TEXT = 'any' THEN true
        ELSE jobpost.status::TEXT = ${status}::TEXT
    END)
    AND (jobpost.title ILIKE '%' || ${search} || '%')
    AND (
        CASE 
            WHEN ${filter}::TEXT = 'week' THEN jobpost.updated_date >= NOW() - INTERVAL '7 days'
            WHEN ${filter}::TEXT = '24 hours' THEN jobpost.updated_date >= NOW() - INTERVAL '1 day'
            WHEN ${filter}::TEXT = 'month' THEN jobpost.updated_date >= NOW() - INTERVAL '1 month'
            ELSE true
        END
    )
ORDER BY 
    jobpost.updated_date DESC
LIMIT ${itemsPerPage} OFFSET ${offset};
