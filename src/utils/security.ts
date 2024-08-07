class securityUtilityClass {
  public cors(req: any, res: any, next: any) {
    // CORS headers
    res.header('Access-Control-Allow-Origin', '*')

    // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS')

    // Set custom headers for CORS
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Authorization, Content-Type, Accept, MetaID, UserID,EID,rrid, hash',
    )

    res.header('Access-Control-Expose-Headers', 'hash')

    if (req.method == 'OPTIONS') {
      res.status(200).end()
    } else {
      next()
    }
  }
}

export const securityUtility = new securityUtilityClass()
