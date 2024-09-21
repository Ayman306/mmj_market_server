SELECT 
jobpost.id jobid,
jobpost.title,
jobpost.company_name,
jobpost.description,
jobpost.responsibility,
jobpost.qualification,
jobpost.employment_type,
jobpost.salary_range,
jobpost.number_of_opening,
jobpost.expiry_date,
jobpost.apply_url,
jobpost.notes,
jobpost.media,
jobpost.created_date,
jobpost.status,

contact.id contactid,
contact.primary_contact,
contact.alternative_contact,
contact.email,
contact.address,
contact.city,
contact.state,
contact.pincode,
contact.geo_location,
contact.web_url,
contact.wa_number,
contact.contact_type

FROM 
    jobpost 
JOIN 
    contact ON jobpost.id = contact.jobpost_id  and jobpost.id=${id};