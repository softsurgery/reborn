#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

const WEB_SRC = path.join(root, "apps/web/src");
const MOBILE_ROOT = path.join(root, "apps/mobile");

const WEB_REPLACEMENTS = [
  [/from "@\/components\/ui\/[^"]+"/g, 'from "@reborn/ui"'],
  [/from '@\/components\/ui\/[^']+'/g, "from '@reborn/ui'"],
  [/from "@\/lib\/utils"/g, 'from "@reborn/lib"'],
  [/from '@\/lib\/utils'/g, "from '@reborn/lib'"],
  [/from "@\/hooks\/useDebounce"/g, 'from "@reborn/hooks/utils"'],
  [/from "@\/hooks\/stores\/useAuthPersistStore"/g, 'from "@reborn/hooks/stores"'],
  [/from "@\/hooks\/stores\/usePreferencePersistStore"/g, 'from "@reborn/hooks/stores"'],
  [/from "@\/contexts\/ThemeContext"/g, 'from "@reborn/contexts"'],
  [/from "@\/contexts\/BreadcrumbContext"/g, 'from "@reborn/contexts"'],
  [/from "@\/contexts\/IntroContext"/g, 'from "@reborn/contexts"'],
  [/from "@\/contexts\/FooterContext"/g, 'from "@reborn/contexts"'],
  [/from "@\/components\/shared\/Spinner"/g, 'from "@reborn/components"'],
  [/from "@\/components\/shared\/LanguageSwitcher"/g, 'from "@reborn/components"'],
  [/from "@\/components\/shared\/ThemeSwitcher"/g, 'from "@reborn/components"'],
  [/from "@\/components\/shared\/Trans"/g, 'from "@reborn/components"'],
  [/from "@\/components\/shared\/Dialogs"/g, 'from "@reborn/components"'],
  [/from "@\/components\/shared\/Sheets"/g, 'from "@reborn/components"'],
  [/from "@\/components\/shared\/JsonEditor"/g, 'from "@reborn/components"'],
  [/from "@\/components\/shared\/JsonToggler"/g, 'from "@reborn/components"'],
  [/from "@\/components\/shared\/JSONExtras"/g, 'from "@reborn/components"'],
  [/from "@\/components\/shared\/Breadcrumb"/g, 'from "@reborn/components"'],
  [/from "@\/components\/shared\/form-builder\/types"/g, 'from "@reborn/form-builder"'],
  [/from "@\/components\/shared\/form-builder\/FormBuilder"/g, 'from "@reborn/form-builder"'],
  [/from "@\/components\/shared\/form-builder\/FieldBuilder"/g, 'from "@reborn/form-builder"'],
  [/from "@\/components\/shared\/form-builder\/PasswordField"/g, 'from "@reborn/form-builder"'],
  [/from "@\/components\/shared\/form-builder\/ImageUploader"/g, 'from "@reborn/form-builder"'],
  [/from "@\/components\/shared\/form-builder\/ImageUploaderManager"/g, 'from "@reborn/form-builder"'],
  [
    /from "@\/components\/shared\/form-builder\/utils\/mapToSelectOptions"/g,
    'from "@reborn/form-builder"',
  ],
  [/from "@\/components\/shared\/data-tables\/types"/g, 'from "@reborn/datatable-builder"'],
  [/from "@\/components\/shared\/data-tables\/data-table"/g, 'from "@reborn/datatable-builder"'],
  [
    /from "@\/components\/shared\/data-tables\/data-table-column-header"/g,
    'from "@reborn/datatable-builder"',
  ],
  [
    /from "@\/components\/shared\/data-tables\/data-table-row-actions"/g,
    'from "@reborn/datatable-builder"',
  ],
  [
    /from "@\/components\/shared\/data-tables\/core\/data-table-cell"/g,
    'from "@reborn/datatable-builder"',
  ],
  [/import axios from "@\/api\/axios"/g, 'import axios from "@/lib/api-default"'],
  [/import axios, \{ BASE_URL \} from "@\/api\/axios"/g, 'import axios, { BASE_URL } from "@/lib/api-default"'],
  [/from "@\/api\/axios"/g, 'from "@/lib/api-default"'],
];

const MOBILE_REPLACEMENTS = [
  [/from "@\/components\/ui\/[^"]+"/g, 'from "@reborn/mobile-ui"'],
  [/from '@\/components\/ui\/[^']+'/g, "from '@reborn/mobile-ui'"],
  [/from "~\/lib\/utils"/g, 'from "@reborn/lib"'],
  [/from "@\/lib\/utils"/g, 'from "@reborn/lib"'],
  [/from "@\/hooks\/stores\/usePreferencePersistStore"/g, 'from "@reborn/hooks/stores"'],
  [/from "@\/hooks\/stores\/useAuthPersistStore"/g, 'from "@reborn/hooks/stores"'],
  [/from "@\/hooks\/useColorPalette"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/hooks\/useRTL"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/hooks\/useKeyboardVisible"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/AppHeader"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/AppHeaderBack"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/BottomButtonBlockWrapper"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/stables\/StableSafeAreaView"/g, 'from "@reborn/mobile-components"'],
  [
    /from "@\/components\/shared\/stables\/StableKeyboardAwareScrollView"/g,
    'from "@reborn/mobile-components"',
  ],
  [/from "@\/components\/shared\/stables\/StablePressable"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/stables\/StableAvatar"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/stables\/StableScrollView"/g, 'from "@reborn/mobile-components"'],
  [/import StableScrollView from "@reborn\/mobile-components"/g, 'import { StableScrollView } from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/stables\/StableScrollable"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/SeeMoreText"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/MarkedInput"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/Tappable"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/SegmentedToggle"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/FileTypeIcon"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/VideoPreview"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/VideoThumbnailPreview"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/ThemeToggle"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/lotties\/Loader"/g, 'from "@reborn/mobile-components"'],
  [/from "\.\/lotties\/Loader"/g, 'from "@reborn/mobile-components"'],
  [/from "\.\.\/lotties\/Loader"/g, 'from "@reborn/mobile-components"'],
  [/from "\.\/lotties\/Success"/g, 'from "@reborn/mobile-components"'],
  [/from "\.\/lotties\/NotFound"/g, 'from "@reborn/mobile-components"'],
  [/from "\.\.\/lotties\/Success"/g, 'from "@reborn/mobile-components"'],
  [/from "\.\.\/lotties\/NotFound"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/form-builder\/types"/g, 'from "@reborn/mobile-form-builder"'],
  [/from "@\/components\/shared\/form-builder\/FormBuilder"/g, 'from "@reborn/mobile-form-builder"'],
  [/from "@\/components\/shared\/form-builder\/FieldBuilder"/g, 'from "@reborn/mobile-form-builder"'],
  [
    /from "@\/components\/shared\/form-builder\/utils\/mapToSelectOptions"/g,
    'from "@reborn/mobile-form-builder"',
  ],
  [/from "@\/lib\/user\.utils"/g, 'from "@reborn/lib"'],
  [/from "@\/lib\/dates\.utils"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/lib\/haptics"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/lib\/android-navigation-bar"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/lib\/video"/g, 'from "@reborn/mobile-components"'],
  [/import \{ hslToHex \} from "@\/lib\/theme"/g, 'import { hslToHex } from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/ThreeDotsActionSheet"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/PhotoPreview"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/VideoPreview"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/VideoThumbnailPreview"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/Stepper"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/MarkedInput"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/AppHeader"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/AppHeaderBack"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/lotties\/Success"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/lotties\/NotFound"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/HTMLText"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/ThemeToggle"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/ThemeSwitcher"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/LanguageSwitcher"/g, 'from "@reborn/mobile-components"'],
  [/from "@\/components\/shared\/InfiniteListFooter"/g, 'from "@/components/shared/InfiniteListFooter"'],
  [/from "@\/components\/\/shared\/AppHeader"/g, 'from "@reborn/mobile-components"'],
  [
    /from "\.\.\/shared\/(AppHeader|AppHeaderBack|MarkedInput|Stepper|PhotoPreview|VideoPreview|VideoThumbnailPreview|ThreeDotsActionSheet|ThemeToggle|ThemeSwitcher|LanguageSwitcher|HTMLText|lotties\/Success|lotties\/NotFound)"/g,
    'from "@reborn/mobile-components"',
  ],
  [
    /from "\.\.\/\.\.\/shared\/(AppHeader|AppHeaderBack|MarkedInput|Stepper|PhotoPreview|VideoPreview|VideoThumbnailPreview|ThreeDotsActionSheet|ThemeToggle|ThemeSwitcher|LanguageSwitcher|HTMLText|lotties\/Success|lotties\/NotFound)"/g,
    'from "@reborn/mobile-components"',
  ],
  [/from "\.\.\/shared\/InfiniteListFooter"/g, 'from "@/components/shared/InfiniteListFooter"'],
  [/from "\.\.\/\.\.\/shared\/InfiniteListFooter"/g, 'from "@/components/shared/InfiniteListFooter"'],
  [
    /import \{ InfiniteListFooter \} from "@reborn\/mobile-components"/g,
    'import { InfiniteListFooter } from "@/components/shared/InfiniteListFooter"',
  ],
  [/import DividedText from "\.\.\/shared\/DividedText"/g, 'import { DividedText } from "@reborn/mobile-components"'],
  [/from "@reborn\/mobile-components";\nimport \{ InfiniteListFooter \} from "@reborn\/mobile-components"/g, 'from "@reborn/mobile-components"'],
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      walk(full, files);
    } else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function applyReplacements(filePath, replacements) {
  let content = fs.readFileSync(filePath, "utf8");
  let changed = false;
  for (const [pattern, replacement] of replacements) {
    const next = content.replace(pattern, replacement);
    if (next !== content) {
      content = next;
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, content);
  }
}

for (const file of walk(WEB_SRC)) {
  applyReplacements(file, WEB_REPLACEMENTS);
}

for (const file of walk(MOBILE_ROOT)) {
  applyReplacements(file, MOBILE_REPLACEMENTS);
}

console.log("Rewired imports in web and mobile apps");
