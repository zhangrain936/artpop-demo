import * as fs from 'fs';
import * as path from 'path';

function replaceInFile(filepath: string, replacements: Array<[RegExp, string]>) {
    let content = fs.readFileSync(filepath, 'utf8');
    for (const [regex, replacement] of replacements) {
        content = content.replace(regex, replacement);
    }
    fs.writeFileSync(filepath, content);
}

// 1. MobileApp wrapper - set base to warm gallery beige
replaceInFile('src/pages/MobileApp/index.tsx', [
    [/bg-white sm:rounded/g, 'bg-[#FAF9F5] sm:rounded'],
    [/bg-white pb-16/g, 'bg-[#FAF9F5] pb-16'],
    [/bg-white\/95 backdrop-blur-xl/g, 'bg-[#FAF9F5]/95 backdrop-blur-xl'],
]);

// 2. MobileHome - Set page background to warm gallery beige, and keep cards as pure white or subtle
replaceInFile('src/pages/MobileApp/MobileHome.tsx', [
    [/bg-\[\#F8F8F8\]/g, 'bg-[#FAF9F5]'], // page background
    [/bg-white sticky top-0/g, 'bg-[#FAF9F5] sticky top-0'], // top header background
]);

// 3. MobileSearch
replaceInFile('src/pages/MobileApp/MobileSearch.tsx', [
    [/bg-\[\#F8F8F8\]/g, 'bg-[#FAF9F5]'],
    [/bg-white sticky top-0/g, 'bg-[#FAF9F5] sticky top-0'],
]);

// 4. MobileDetail
replaceInFile('src/pages/MobileApp/MobileDetail.tsx', [
    [/bg-\[\#F8F8F8\]/g, 'bg-[#FAF9F5]'],
    [/bg-white sticky bottom-0/g, 'bg-[#FAF9F5] sticky bottom-0'],
]);

// 5. MobileCategory
replaceInFile('src/pages/MobileApp/MobileCategory.tsx', [
    [/bg-white min-h-screen/g, 'bg-[#FAF9F5] min-h-screen'],
    [/bg-\[\#F8F8F8\]/g, 'bg-[#FAF9F5]'],
]);

// 6. MobileAuthor
replaceInFile('src/pages/MobileApp/MobileAuthor.tsx', [
    [/bg-white min-h-screen/g, 'bg-[#FAF9F5] min-h-screen'],
    [/bg-\[\#F8F8F8\]/g, 'bg-[#F2EFE8]'], // author header diff
]);

// 7. MobileProfile
replaceInFile('src/pages/MobileApp/MobileProfile.tsx', [
    [/bg-\[\#F8F8F8\] min-h-screen/g, 'bg-[#FAF9F5] min-h-screen'],
    [/bg-\[\#F8F8F8\]/g, 'bg-[#FAF9F5]'],
]);

// 8. MobileWorkspace
replaceInFile('src/pages/MobileApp/MobileWorkspace.tsx', [
    [/bg-\[\#F8F8F8\] min-h-screen/g, 'bg-[#FAF9F5] min-h-screen'],
    [/bg-white p-4/g, 'bg-[#FAF9F5] p-4'], // maybe
]);

console.log("Warm backgrounds applied globally.");
