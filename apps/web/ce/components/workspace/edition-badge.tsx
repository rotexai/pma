/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { observer } from "mobx-react";
import { Tooltip } from "@plane/propel/tooltip";
import { usePlatformOS } from "@/hooks/use-platform-os";
import packageJson from "package.json";
import { Button } from "@plane/propel/button";

export const WorkspaceEditionBadge = observer(function WorkspaceEditionBadge() {
  const { isMobile } = usePlatformOS();

  return (
    <Tooltip tooltipContent={`Version: v${packageJson.version}`} isMobile={isMobile}>
      <Button variant="tertiary" size="lg">
        Plane
      </Button>
    </Tooltip>
  );
});
