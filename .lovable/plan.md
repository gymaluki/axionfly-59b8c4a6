The issue seems to be two-fold:
1. **Extension Token Display Bug**: The `Extension.tsx` component is trying to read `license_key` from the RPC result, but the database function returns a column named `key`. This results in the token being shown as undefined (or "Sem licenças disponíveis") for everyone.
2. **Data Leakage (localStorage)**: The `ProspeccaoView` and `SitesView` save their state (leads, site creation steps) to `localStorage` using generic keys. If multiple users use the same browser, they see each other's data. This matches the user's description of data "going to same accounts".

### Technical Details
- **Database**: Modify `claim_hyperbuild_license` RPC to return the column name as `license_key` to match the generated types and prevent confusion.
- **Frontend**: 
  - Update `Extension.tsx` to correctly handle the returned token.
  - Prefix `localStorage` keys with the `user_id` in `ProspeccaoView` and `SitesView`.
  - Add a logout handler to clear user-specific data from memory if needed (though `user_id` prefixing handles the privacy issue better).

### Steps
1. **Database Migration**:
   - Update `claim_hyperbuild_license` to return `license_key` instead of `key` in the `RETURNS TABLE` clause and the `SELECT` statement.
2. **Component Updates**:
   - `src/components/views/ProspeccaoView.tsx`: Prefix `localStorage` keys with `user_id`.
   - `src/components/views/SitesView.tsx`: Prefix `localStorage` keys with `user_id`.
   - `src/pages/Extension.tsx`: Ensure it reads the correct property from the RPC response.
3. **Verification**:
   - Check if tokens now display correctly in the Extension page.
   - Verify that logging out and into another account shows separate lead/site data.
