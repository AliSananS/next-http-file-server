import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
} from '@heroui/navbar';
import NextLink from 'next/link';

import { siteConfig } from '@/config/site';
import { ThemeSwitch } from '@/components/theme-switch';
import { Logo, SettingsIcon } from '@/components/icons';
// import { useTheme } from 'next-themes'

export const Navbar = () => {
  // const { resolvedTheme } = useTheme();

  return (
    <HeroUINavbar className="lg:max-w-7xl" maxWidth="full" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="max-w-screen-lg gap-3">
          <NextLink className="flex items-center justify-start gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">{siteConfig.name}</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
        <ThemeSwitch />
        {/* <SettingsIcon /> */}
      </NavbarContent>
    </HeroUINavbar>
  );
};
