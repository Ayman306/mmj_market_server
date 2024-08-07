SELECT 
    json_build_object(
        'job_detail', json_build_object(
            'id', business.id,
            'name', business.name,
            'tag_line', business.tag_line,
            'about', business.about,
            'time', business.time,
            'amenities', business.amenities,
            'media',business.media,
            'created_date',business.created_date,
            'status',business.status
        ),
        'contact_details', json_build_object(
            'id',contact.id,
            'business_id', business.id,
            'contact_available', true,
            'address', contact.address,
            'city', contact.city,
            'state', contact.state,
            'primary_contact', contact.primary_contact            
        )
    ) AS business
FROM 
    business 
JOIN 
    contact ON business.id = contact.business_id 
WHERE 
    CASE 
    WHEN ${status}::TEXT = 'any' THEN true
    ELSE business.status::TEXT = ${status}::TEXT
END
LIMIT ${itemsPerPage} OFFSET ${offset};