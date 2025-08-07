/*
 * Copyright 2025 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* eslint-disable no-console */
(() => {
  // remove "Article Contains" contents
  document.querySelectorAll('.c-article__table-of-content-sticky').forEach((el) => el.remove());

  // remove cookie consent components
  document.querySelectorAll('.ensNotifyBanner').forEach((el) => el.remove());

  // Remove bottom identity theft sales pitch
  document.querySelectorAll('.c-stickybanner__container').forEach((el) => el.remove());

  // Remove CPRA compliance spacer (messes with xpath to main)
  document.querySelectorAll('.cpra-compliance-banner-spacer').forEach((el) => el.remove());
})();
