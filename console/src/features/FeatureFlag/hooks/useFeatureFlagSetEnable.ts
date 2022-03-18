import { useMutation, useQueryClient } from 'react-query';
import { FeatureFlagId, useFeatureFlags } from '@/features/FeatureFlag';
import { saveFeatureFlagsStateToLocalStorage } from '../utils';

export function useFeatureFlagDismiss() {
  const queryClient = useQueryClient();
  const { data, isError, isLoading } = useFeatureFlags();

  return useMutation(
    async ({
      flagId,
      newState,
    }: {
      flagId: FeatureFlagId;
      newState: boolean;
    }) => {
      if (isError || isLoading || !data) {
        throw new Error('Feature flags not loaded');
      }
      const newFlags = data.map(item => {
        if (item.id !== flagId) {
          return item;
        }
        return {
          ...item,
          state: {
            ...item.state,
            enable: newState,
            enableDate: new Date(),
          },
        };
      });

      return saveFeatureFlagsStateToLocalStorage(newFlags);
    },
    {
      onSuccess: () => queryClient.invalidateQueries('featureFlags'),
    }
  );
}