SELECT 
    json_build_object(
        'business_detail', json_build_object(
             'id', business.id,
            'company_name', business.company_name,
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
    ) AS business
FROM 
    business 
JOIN 
    contact ON business.id = contact.business_id where business.status = true and business.id=${id};