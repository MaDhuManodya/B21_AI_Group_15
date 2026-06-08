# ============================================================
# OWNER: Manodya
# MODULE: Category list — row actions (edit icon + delete icon)
# SRS REFERENCE: §5.1 — Admin-Specific Features (Edit / Delete)
# COVERAGE NOTES:
#   - Edit icon -> /ui/categories/edit/{id}
#   - Delete icon -> confirmation prompt -> row removed
#   - User: Edit and Delete icons hidden / disabled
# TAGS: @manodya @categories @ui  + @admin|@user + @smoke/@rbac
# REUSE: CategoryListPage.ts (clickEdit, clickDelete, confirmDelete — TODO Manodya).
# ============================================================
@manodya @categories @ui
Feature: Category Row Actions

  # TODO Manodya: implement edit/delete action scenarios.
  # Suggested IDs: UI_CATEGORY_ADMIN_008 (delete with prompt), UI_CATEGORY_USER_005 (no edit/delete icons).
