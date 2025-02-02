// Copyright © 2022 Meroxa, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package provisioning

// EnrichPipelinesConfig sets default values for pipeline config fields
func EnrichPipelinesConfig(mp map[string]PipelineConfig) map[string]PipelineConfig {
	for k, cfg := range mp {
		if cfg.Name == "" {
			cfg.Name = k
		}
		if cfg.Status == "" {
			cfg.Status = StatusRunning
		}
		cfg.Connectors = enrichConnectorsConfig(cfg.Connectors, k)
		cfg.Processors = enrichProcessorsConfig(cfg.Processors, k)
		mp[k] = cfg
	}
	return mp
}

// enrichConnectorsConfig sets default values for connectors config fields
func enrichConnectorsConfig(mp map[string]ConnectorConfig, pipelineID string) map[string]ConnectorConfig {
	newMap := make(map[string]ConnectorConfig, len(mp))
	for k, cfg := range mp {
		if cfg.Name == "" {
			cfg.Name = k
		}
		// attach the pipelineID to the connectorID
		cfg.Name = pipelineID + ":" + cfg.Name
		newID := pipelineID + ":" + k
		cfg.Processors = enrichProcessorsConfig(cfg.Processors, newID)
		newMap[newID] = cfg
	}
	return newMap
}

// enrichProcessorsConfig sets default values for processors config fields
func enrichProcessorsConfig(mp map[string]ProcessorConfig, parentID string) map[string]ProcessorConfig {
	newMap := make(map[string]ProcessorConfig, len(mp))
	for k, cfg := range mp {
		newID := parentID + ":" + k
		newMap[newID] = cfg
	}
	return newMap
}
