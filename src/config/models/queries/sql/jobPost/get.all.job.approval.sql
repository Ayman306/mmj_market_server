SELECT 
jobpost.id jobid,
jobpost.title,
jobpost.company_name,
jobpost.employment_type,
jobpost.media,
jobpost.created_date,
jobpost.status,

contact.id contactid,
contact.city,
contact.state,
contact.primary_contact,
COUNT(contact.id) OVER () AS totalcount  -- Optimized to use window function for total count

FROM 
    jobpost 
JOIN 
    contact ON jobpost.id = contact.jobpost_id 
WHERE 
    jobpost.approval_date IS NULL
    AND (jobpost.title ILIKE '%' || ${search} || '%')
    AND (
        CASE 
            WHEN ${filter}::TEXT = 'week' THEN jobpost.updated_date >= NOW() - INTERVAL '7 days'
            WHEN ${filter}::TEXT = '24 hours' THEN jobpost.updated_date >= NOW() - INTERVAL '1 day'
            WHEN ${filter}::TEXT = 'month' THEN jobpost.updated_date >= NOW() - INTERVAL '1 month'
            WHEN ${filter}::TEXT = 'active' THEN jobpost.status = true 
            WHEN ${filter}::TEXT = 'inactive' THEN jobpost.status = false          
            ELSE true
        END
    )
ORDER BY 
    jobpost.updated_date DESC
LIMIT ${itemsPerPage} OFFSET ${offset};
