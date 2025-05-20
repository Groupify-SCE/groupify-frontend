import * as XLSX from 'xlsx';

export const exportGroupsToExcel = (groups) => {
  // Prepare data for Excel
  const excelData = groups.flatMap((group, groupIndex) =>
    group.map((member) => {
      const hasPreferences =
        member.preferences && member.preferences.length > 0;
      const isMatched =
        hasPreferences &&
        member.preferences.some((prefId) =>
          group.some((groupMember) => groupMember.id === prefId)
        );

      return {
        'Group Number': `Group ${groupIndex + 1}`,
        Name: member.name,
        'ID Number': member.tz,
        'Preference Status': !hasPreferences
          ? 'No Preferences'
          : isMatched
            ? 'Matched ✓'
            : 'Not Matched ✗',
      };
    })
  );

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(excelData);

  // Set column widths
  const colWidths = [
    { wch: 12 }, // Group Number
    { wch: 25 }, // Name
    { wch: 15 }, // ID Number
    { wch: 20 }, // Preference Status
  ];
  ws['!cols'] = colWidths;

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Group Assignments');

  // Generate Excel file
  XLSX.writeFile(wb, 'group_assignments.xlsx');
};
