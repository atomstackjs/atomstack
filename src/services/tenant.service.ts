const TenantServiceSchema = {
  name: "$stack.tenant"
  actions: {
    register: {
      params: {
        id: "string",
      }
    }
  }
}
