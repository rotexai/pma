/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useEffect } from "react";
import { observer } from "mobx-react";
import { useParams } from "next/navigation";
// plane imports
import { useTranslation } from "@plane/i18n";
import { ContentWrapper } from "@plane/ui";
// components
import { ActiveCycleRoot } from "@/plane-web/components/cycles";
// hooks
import { useCycle } from "@/hooks/store/use-cycle";
import { useProject } from "@/hooks/store/use-project";

export const WorkspaceActiveCyclesRoot = observer(function WorkspaceActiveCyclesRoot() {
  const { workspaceSlug } = useParams();
  const { t } = useTranslation();
  const { workspaceProjectIds } = useProject();
  const { fetchActiveCycle } = useCycle();

  useEffect(() => {
    if (!workspaceSlug || !workspaceProjectIds) return;
    workspaceProjectIds.forEach((projectId) => {
      fetchActiveCycle(workspaceSlug.toString(), projectId);
    });
  }, [workspaceSlug, workspaceProjectIds, fetchActiveCycle]);

  if (!workspaceProjectIds || workspaceProjectIds.length === 0) {
    return (
      <ContentWrapper className="flex items-center justify-center">
        <p className="text-tertiary">{t("no_projects_found")}</p>
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper className="gap-0">
      {workspaceProjectIds.map((projectId) => (
        <ActiveCycleRoot
          key={projectId}
          workspaceSlug={workspaceSlug.toString()}
          projectId={projectId}
          showHeader
        />
      ))}
    </ContentWrapper>
  );
});
